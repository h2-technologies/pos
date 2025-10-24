
<svelte:head>
  <title>Login</title>
</svelte:head>

<div class="flex h-screen items-center justify-center">
  <button 
    class="focus:shadow-outline"
    type="button"
    onclick={() => (window.location.href="/login/google")}
  >
  Continue with google
  </button>
</div>