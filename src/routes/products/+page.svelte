<script lang="ts">
	import { page } from "$app/state";
	import type { User } from '@workos/authkit-sveltekit';
	import { enhance } from '$app/forms';
  import type { Product } from "../../../generated/prisma/client";
	import { Modal, Button } from 'flowbite-svelte';

	let user: User = page.data.user;
	let products: Product[] = page.data.products;
	let isAdmin: boolean = page.data.admin;
	let showCreateModal = $state(false);
	let showEditModal = $state(false);
	let selectedProduct = $state<Product | null>(null);
	let selectedCategory = $state<string>('');
	let searchQuery = $state<string>('');

	let filteredProducts = $derived(products.filter(p => {
		const matchesCategory = !selectedCategory || p.category === selectedCategory;
		const query = searchQuery.toLowerCase();
		const matchesSearch = !query || 
			p.sku.toLowerCase().includes(query) || 
			(p.synnexNumber?.toLowerCase().includes(query) || false) ||
			p.productName.toLowerCase().includes(query);
		return matchesCategory && matchesSearch;
	}));

	let categories = $derived([...new Set(products.map(p => p.category).filter(Boolean))] as string[]);

	function openEditModal(product: Product) {
		selectedProduct = product;
		showEditModal = true;
	}

	function calculateCost(product: Product): number {
		return product.extendedPrice + product.shipping;
	}

	function calculateProfit(product: Product): number {
		return product.price - calculateCost(product);
	}

	function calculateDifference(product: Product): number {
		if (product.msrp === 0) return 0;
		return ((product.price - product.msrp) / product.msrp) * 100;
	}

	function calculateMargin(product: Product): number {
		const profit = calculateProfit(product);
		return (profit / product.price) * 100;
	}

	function getMarginColor(margin: number): string {
		if (margin >= 20) return 'text-green-600';
		if (margin >= 10) return 'text-yellow-600';
		if (margin >= 5) return 'text-orange-600';
		return 'text-red-600';
	}
</script>

<svelte:head>
	<title>Product Catalog | H2 Point of Sale</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-gray-50">
	<div class="bg-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<div>
				<h1 class="text-3xl font-bold tracking-tight text-gray-900">Product Catalog</h1>
				<p class="mt-2 text-sm text-gray-600">Browse and manage products inventory</p>
				</div>
				<div class="flex gap-3">
					{#if isAdmin}
						<button
							onclick={() => showCreateModal = true}
							class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
						>
							+ Create Product
						</button>
					{/if}
					<a
						href="/"
						class="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
					>
						← Back to Dashboard
					</a>
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto" class:max-w-7xl={!isAdmin} class:mx-auto={!isAdmin}>
		<div class="py-6 px-4 sm:px-6 lg:px-8 w-full">
			<div class="rounded-lg bg-white shadow p-4 mb-1">
				<div class="flex items-center gap-4 flex-wrap">
					<input
						type="text"
						placeholder="Search by SKU, Part #, or Product Name..."
						bind:value={searchQuery}
						class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border flex-grow min-w-64"
					/>
					<label for="category-filter" class="text-sm font-medium text-gray-700">Category:</label>
					<select
						id="category-filter"
						bind:value={selectedCategory}
						class="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border min-w-40"
					>
						<option value="">All Categories</option>
						{#each categories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
					<span class="text-sm text-gray-500">
						Showing {filteredProducts.length} of {products.length} products
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class="px-4 sm:px-6 lg:px-8 py-2 w-full" class:max-w-7xl={!isAdmin} class:mx-auto={!isAdmin}>
		<div class="rounded-lg bg-white shadow overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Manufacturer
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Category
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Product Name
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							H2 SKU
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Synnex Number
						</th>
						<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
							Price
						</th>
						{#if isAdmin}
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Shipping
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Cost
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Profit
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Difference
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Margin %
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						{/if}
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
				{#each filteredProducts as product (product.id)}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
								{product.manufacturer}
							</td>						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							{product.category || '-'}
						</td>							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
								{product.productName}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{product.sku}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
								{product.synnexNumber || '-'}
							</td>
							<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
								${product.price.toFixed(2)}
							</td>
							{#if isAdmin}
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									${product.shipping.toFixed(2)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
									${calculateCost(product).toFixed(2)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium"
									class:text-green-600={calculateProfit(product) > 0}
									class:text-red-600={calculateProfit(product) < 0}
								>
									${calculateProfit(product).toFixed(2)}
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium"
									class:text-green-600={calculateDifference(product) < 0}
									class:text-red-600={calculateDifference(product) > 0}
								>
									{calculateDifference(product).toFixed(2)}%
								</td>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium {getMarginColor(calculateMargin(product))}">
									{calculateMargin(product).toFixed(2)}%
								</td>							<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
								<button
									onclick={() => openEditModal(product)}
									class="text-blue-600 hover:text-blue-900"
								>
									Edit
								</button>
							</td>							{/if}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="mt-4 text-sm text-gray-600">
			Showing {filteredProducts.length} of {products.length} products
		</div>
	</div>
</div>

<!-- Create Product Modal -->
<Modal bind:open={showCreateModal} size="lg" autoclose={false}>
	<form method="POST" action="?/create" use:enhance={() => {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				showCreateModal = false;
				window.location.reload();
			}
		};
	}}>
		<div class="mb-4">
			<h3 class="text-lg font-medium leading-6 text-gray-900">Create New Product</h3>
		</div>

		<div class="space-y-4">
			<div>
				<label for="manufacturer" class="block text-sm font-medium text-gray-700 mb-1">Manufacturer *</label>
				<input
					type="text"
					name="manufacturer"
					id="manufacturer"
					required
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
				/>
			</div>

			<div>
				<label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
				<input
					type="text"
					name="category"
					id="category"
					required
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
				/>
			</div>

			<div>
				<label for="productName" class="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
				<input
					type="text"
					name="productName"
					id="productName"
					required
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
				/>
			</div>

			<div>
				<label for="sku" class="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
				<input
					type="text"
					name="sku"
					id="sku"
					required
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
				/>
			</div>

			<div>
				<label for="synnexNumber" class="block text-sm font-medium text-gray-700 mb-1">Synnex Number</label>
				<input
					type="text"
					name="synnexNumber"
					id="synnexNumber"
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price</label>
					<input
						type="number"
						step="0.01"
						name="price"
						id="price"
						class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
					/>
				</div>

				<div>
					<label for="msrp" class="block text-sm font-medium text-gray-700 mb-1">MSRP</label>
					<input
						type="number"
						step="0.01"
						name="msrp"
						id="msrp"
						class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
					/>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="extendedPrice" class="block text-sm font-medium text-gray-700 mb-1">Extended Price</label>
					<input
						type="number"
						step="0.01"
						name="extendedPrice"
						id="extendedPrice"
						class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
					/>
				</div>

				<div>
					<label for="shipping" class="block text-sm font-medium text-gray-700 mb-1">Shipping</label>
					<input
						type="number"
						step="0.01"
						name="shipping"
						id="shipping"
						class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
					/>
				</div>
			</div>
		</div>

		<div class="mt-5 flex gap-3 justify-end">
			<Button type="button" color="alternative" onclick={() => showCreateModal = false}>
				Cancel
			</Button>
			<Button type="submit" color="blue">
				Create Product
			</Button>
		</div>
	</form>
</Modal>

<!-- Edit Product Modal -->
{#if selectedProduct}
<Modal bind:open={showEditModal} size="lg" autoclose={false}>
	<form method="POST" action="?/edit" use:enhance={() => {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				showEditModal = false;
				selectedProduct = null;
				window.location.reload();
			}
		};
	}}>
		<input type="hidden" name="id" value={selectedProduct.id} />
		<div class="mb-4">
			<h3 class="text-lg font-medium leading-6 text-gray-900">Edit Product</h3>
		</div>

		<div class="space-y-4">
			<div>
				<label for="edit-manufacturer" class="block text-sm font-medium text-gray-700 mb-1">Manufacturer *</label>
				<input
					type="text"
					name="manufacturer"
					id="edit-manufacturer"
					value={selectedProduct.manufacturer}
					required
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
				/>
			</div>

			<div>
				<label for="edit-category" class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
				<input
					type="text"
					name="category"
					id="edit-category"
					value={selectedProduct.category || ''}
					required
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
				/>
			</div>

			<div>
				<label for="edit-productName" class="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
				<input
					type="text"
					name="productName"
					id="edit-productName"
					value={selectedProduct.productName}
					required
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
				/>
			</div>

			<div>
				<label for="edit-sku" class="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
				<input
					type="text"
					name="sku"
					id="edit-sku"
					value={selectedProduct.sku}
					required
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
				/>
			</div>

			<div>
				<label for="edit-synnexNumber" class="block text-sm font-medium text-gray-700 mb-1">Synnex Number</label>
				<input
					type="text"
					name="synnexNumber"
					id="edit-synnexNumber"
					value={selectedProduct.synnexNumber || ''}
					class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="edit-price" class="block text-sm font-medium text-gray-700 mb-1">Price</label>
					<input
						type="number"
						step="0.01"
						name="price"
						id="edit-price"
						value={selectedProduct.price}
						class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
					/>
				</div>

				<div>
					<label for="edit-msrp" class="block text-sm font-medium text-gray-700 mb-1">MSRP</label>
					<input
						type="number"
						step="0.01"
						name="msrp"
						id="edit-msrp"
						value={selectedProduct.msrp}
						class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
					/>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="edit-extendedPrice" class="block text-sm font-medium text-gray-700 mb-1">Extended Price</label>
					<input
						type="number"
						step="0.01"
						name="extendedPrice"
						id="edit-extendedPrice"
						value={selectedProduct.extendedPrice}
						class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
					/>
				</div>

				<div>
					<label for="edit-shipping" class="block text-sm font-medium text-gray-700 mb-1">Shipping</label>
					<input
						type="number"
						step="0.01"
						name="shipping"
						id="edit-shipping"
						value={selectedProduct.shipping}
						class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
					/>
				</div>
			</div>
		</div>

		<div class="mt-5 flex gap-3 justify-end">
			<Button type="button" color="alternative" onclick={() => { showEditModal = false; selectedProduct = null; }}>
				Cancel
			</Button>
			<Button type="submit" color="blue">
				Update Product
			</Button>
		</div>
	</form>
</Modal>
{/if}
