<script lang="ts">
	import invoiceIcon from '$lib/icons/invoice.svg';
	import customerIcon from '$lib/icons/desk-customer.svg';
	import orderIcon from '$lib/icons/orders.svg';

  import { page } from "$app/state";
	import type { User } from '@workos/authkit-sveltekit';

	let user: User = page.data.user;
</script>

<div class="flex min-h-screen flex-col bg-gray-50">
	<div class="bg-white shadow">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<h1 class="text-3xl font-bold tracking-tight text-gray-900">Welcome, {user.firstName}</h1>
			<p class="mt-2 text-sm text-gray-600">User Dashboard</p>
		</div>
	</div>

	<div class="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
		<div class="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
			<!-- Part Catalog Card -->
			<div class="overflow-hidden rounded-lg bg-white shadow hover:shadow-lg transition-shadow">
				<div class="px-6 py-8">
					<h3 class="text-lg font-medium leading-6 text-gray-900">Product Catalog</h3>
					<p class="mt-2 text-sm text-gray-500">Browse and manage the products inventory.</p>
					<div class="mt-6">
						<a
							href="/parts"
							class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
						>
							Open Catalog
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
