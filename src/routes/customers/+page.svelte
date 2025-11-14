<script lang="ts">
  import { page } from "$app/state";
  import type { Customer, CustomerNote } from "@prisma/client";
  import { Modal, Toast } from "flowbite-svelte";
	import { BanOutline, CheckCircleSolid } from "flowbite-svelte-icons";

  let customers: Customer[] = $state(page.data.customers);

  let editModal = $state(false);
  let addModal = $state(false);
	let viewModal = $state(false);

  let targetCustomer: Customer & { notes: CustomerNote[] | undefined } | undefined = $state(undefined);

	async function handleCustomerCreate() {
		if (targetCustomer == undefined) {
			//Problem
			return;
		}

		const req = await fetch('/customers', {
			method: 'POST',
			body: JSON.stringify(targetCustomer)
		})

		const res = await req.json();

		if (res.success) {
			triggerSuccess();
			targetCustomer.id = res.id;
			customers.push({ ...targetCustomer });
		} else {
			triggerError();
		}

		addModal = false;
	}

	async function handleCustomerEdit() {
		if (targetCustomer == undefined) {
			//problem
			return;
		}

		const req = await fetch('/customers', {
			method: "PUT",
			body: JSON.stringify(targetCustomer)
		})

		const res = await req.json();

		if (res.success) {
			triggerSuccess();
			let idx = customers.findIndex(customer => customer.id == targetCustomer!.id);
			customers[idx] = { ...targetCustomer };
		} else {
			triggerError();
		}

		editModal = false;
	}

	async function handleCustomerDelete() {
		if (targetCustomer == undefined) {
			//problem
			return;
		}

		if (confirm(`Are you sure you want to delete ${targetCustomer.name}? This action cannot be undone.`)) {
			const req = await fetch('/customers', {
				method: "DELETE",
				body: JSON.stringify({ id: targetCustomer.id })
			})

			const res = await req.json();

			if (res.success) {
				triggerSuccess();
				customers = customers.filter(customer => customer.id != targetCustomer!.id);
			} else {
				triggerError();
			}

			editModal = false;
		} else {
			editModal = true;
			return;
		}
	}

	let successToastStatus = $state(false);
	let errorToastStatus = $state(false);
	let counter = $state(5);

	function triggerSuccess() {
		successToastStatus = true;
		counter = 5;
		timeout();
	}

	function triggerError() {
		errorToastStatus = true;
		counter = 5;
		timeout();
	}

	function timeout() {
		if (--counter > 0) return setTimeout(timeout, 1000);
		successToastStatus = false;
		errorToastStatus = false;
	}

</script>

<svelte:head>
	<title>Customers - H2 POS</title>
</svelte:head>

<!-- Create Customer Modal -->
<Modal bind:open={addModal} class="overflow-hidden bg-white" autoclose>
  <div>
		<p class="mb-4 text-lg font-semibold">Add Customer</p>
		<div class="mb-4">
			<label for="customerName" class="block text-sm font-medium text-gray-700">Customer Name</label
			>
			<input
				type="text"
				id="customerName"
				bind:value={targetCustomer!.name}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<div class="mb-4">
			<label for="contactPhone" class="block text-sm font-medium text-gray-700">Contact Phone</label
			>
			<input
				type="tel"
				id="contactPhone"
				bind:value={targetCustomer!.phone}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<div class="mb-4">
			<label for="contactEmail" class="block text-sm font-medium text-gray-700">Contact Email</label
			>
			<input
				type="email"
				id="contactEmail"
				bind:value={targetCustomer!.email}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<div class="mb-4">
			<label for="address" class="block text-sm font-medium text-gray-700">Address</label>
			<input
				type="text"
				id="address"
				bind:value={targetCustomer!.address}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		
		<button
			onclick={handleCustomerCreate}
			class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
		>
			Add Customer
		</button>
	</div>
</Modal>

<!-- Edit Customer Modal -->
<Modal bind:open={editModal} class="overflow-hidden bg-white" >
  <div>
		<p class="mb-4 text-lg font-semibold">Edit Customer</p>
		<div class="mb-4">
			<label for="customerName" class="block text-sm font-medium text-gray-700">Customer Name</label
			>
			<input
				type="text"
				id="customerName"
				bind:value={targetCustomer!.name}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<div class="mb-4">
			<label for="contactPhone" class="block text-sm font-medium text-gray-700">Contact Phone</label
			>
			<input
				type="tel"
				id="contactPhone"
				bind:value={targetCustomer!.phone}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<div class="mb-4">
			<label for="contactEmail" class="block text-sm font-medium text-gray-700">Contact Email</label
			>
			<input
				type="email"
				id="contactEmail"
				bind:value={targetCustomer!.email}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		<div class="mb-4">
			<label for="address" class="block text-sm font-medium text-gray-700">Address</label>
			<input
				type="text"
				id="address"
				bind:value={targetCustomer!.address}
				class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			/>
		</div>
		
		<button
			onclick={handleCustomerEdit}
			class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
			type="submit"
		>
			Edit Customer
		</button>
		<button
			onclick={handleCustomerDelete}
			class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
			type="button"
		>
			Delete Customer
		</button>
	</div>
</Modal>

<Modal bind:open={viewModal} class="overflow-hidden bg-white">
	<div>
		<p class="mb-4 text-lg font-semibold">{targetCustomer!.name}</p>
		<div class="mb-4">
			<label for="contactPhone" class="block text-sm font-medium text-gray-700">Contact Phone</label>
			<p class="mt-1 text-gray-900">{targetCustomer!.phone}</p>
		</div>
		<div class="mb-4">
			<label for="contactEmail" class="block text-sm font-medium text-gray-700">Contact Email</label>
			<p class="mt-1 text-gray-900">{targetCustomer!.email}</p>
		</div>
		<div class="mb-4">
			<label for="address" class="block text-sm font-medium text-gray-700">Address</label>
			<p class="mt-1 text-gray-900">{targetCustomer!.address}</p>
		</div>
		<div class="mb-4">
			<label for="notes">Notes</label>
			{#each targetCustomer!.notes as note}
				<div class="outline-solid outline-2">
					<p class="mt-1 ml-2 font-black text-black">{note.postedBy} - {new Date(note.createdAt).toLocaleString()}</p>
					<p class="mt-1 ml-2 text-black">{note.note}</p>
				</div>
			{/each}
		</div>
		<textarea class="w-full">
			Notes
		</textarea>
		<p class="text-green-400 -mt-0.5 cursor-pointer justify-end" onclick={() => { /* Add note functionality here */ }}>+ Add Note</p>
	</div>
</Modal>

<Toast
 dismissable={false}
 position="top-right"
 bind:toastStatus={successToastStatus}
 class="bg-green-500 text-white"
>
	<div class="flex items-center">
		<CheckCircleSolid class="mr-1.5 h-5 w-5" />
		<span>Changes saved successfully!</span>
	</div>
</Toast>

<table class="min-w-full divide-y divide-gray-200">
  <thead class="bg-gray-50">
		<tr>
			<th
				scope="col"
				class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
				>Customer Account Number</th
			>
			<th
				scope="col"
				class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
				>Customer Name</th
			>
			<th
				scope="col"
				class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
				>Customer Phone</th
			>
			<th
				scope="col"
				class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
				>Customer Email</th
			>
			<th
				scope="col"
				class="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
				>Actions</th
			>
		</tr>
	</thead>
	<tbody class="divide-y divide-gray-200 bg-white">
		{#each customers as customer (customer.id)}
			<tr>
        <td class="px-6 py-4 whitespace-nowrap">{customer.id}</td>
				<td class="px-6 py-4 whitespace-nowrap">{customer.name}</td>
				<td class="px-6 py-4 whitespace-nowrap">{customer.phone}</td>
				<td class="px-6 py-4 whitespace-nowrap">{customer.email}</td>
				<td class="px-6 py-4 text-right whitespace-nowrap">
					<button
						onclick={() => {
							targetCustomer = { ...customer };
							editModal = true;
						}}
						class="text-blue-600 hover:text-blue-900 cursor-pointer">Edit</button
					>
					<button onclick={() => { targetCustomer = { ...customer }; viewModal = true }} class="ml-4 text-green-600 hover:text-green-900 cursor-pointer">View</button>
				</td>
			</tr>
		{/each}
	</tbody>

</table>

<div class="mt-4 flex justify-center">
  <button 
    onclick={() => {
      targetCustomer = { id: "", name: "", phone: "", email: "", address: "", active: true };
      addModal = true;
    }}
    class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 cursor-pointer"
  >
    Add Customer
  </button>
</div>