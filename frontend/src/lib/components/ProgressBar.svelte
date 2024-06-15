<!-- ProgressBar.svelte -->
<script>
    export let titleHeading;
    export let percentage = 0; // Expects a value between 0 and 100
    export let completed = 0;
    export let total = 0;
  </script>
  
  <div class="w-full rounded-full h-4">
    <div class="h-4 rounded-full" style="width: {percentage}%"></div>
  </div>
    <p>
      {titleHeading}: {percentage}% Complete - {completed} Out of {total}
    </p>