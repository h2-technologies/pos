<script lang="ts">
  import { page } from "$app/state";
	import type { Order } from "@prisma/client";

  let orders: Order[] = $state(page.data.orders);


</script>

<svelte:head>
  <title>Orders - H2 POS</title>
</svelte:head>

