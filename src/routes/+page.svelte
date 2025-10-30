<script lang="ts">
	import invoiceIcon from '$lib/icons/invoice.svg';
	import customerIcon from '$lib/icons/desk-customer.svg';

  import { page } from "$app/state";

</script>

<div class="flex min-h-screen flex-col bg-gray-200">
	<div class="m-2 flex flex-col items-center p-2">
		<h1 class="text-4xl font-bold">Welcome, {page.data.user.name.split(" ")[0]}</h1>
		<h2 class="text-2xl font-semibold">User Dashboard</h2>
	</div>

	<div class="flex w-full flex-wrap justify-center gap-6 px-2">
		<div class="h-1/8 w-full max-w-2xl rounded-lg bg-white p-6 shadow-md">
			<h3 class="mb-4 text-lg font-semibold">Tools</h3>
			<div class="grid grid-cols-3 gap-4">
				<!-- <button
					class="flex flex-col items-center rounded-lg bg-orange-500 p-3 text-black transition-opacity hover:opacity-90"
				>
					<a href="/create-invoice" class="flex flex-col items-center">
						<img src={invoiceIcon} width="64" height="64" alt="Create Invoice Icon" />
						<span>Create Invoice</span>
					</a>
				</button>
				<button
					class="flex flex-col items-center rounded-lg bg-orange-500 p-3 text-black transition-opacity hover:opacity-90"
				>
					<a href="/dashboard/create-quote" class="flex flex-col items-center">
						<img src={invoiceIcon} width="64" height="64" alt="Create Quote Icon" />
						<span>Create quote</span>
					</a>
				</button>
				<button
					class="flex flex-col items-center rounded-lg bg-orange-500 p-3 text-black transition-opacity hover:opacity-90"
				>
					<a href="/view-invoices" class="flex flex-col items-center">
						<img src={invoiceIcon} width="64" height="64" alt="View Invoices Icon" />
						<span>View Invoices</span>
					</a>
				</button> -->
				<button
					class="flex flex-col items-center rounded-lg bg-yellow-500 p-3 text-black transition-opacity hover:opacity-90"
				>
					<a href="/customers" class="flex flex-col items-center">
						<img src={customerIcon} width="64" height="64" alt="Add/Remove Customer Icon" />
						<span>Customer Management</span>
					</a>
				</button>
			</div>
		</div>
	</div>
</div>
