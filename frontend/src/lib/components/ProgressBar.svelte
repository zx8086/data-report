<!-- ProgressBar.svelte -->
<script>
  export let titleHeading = "Progress";
  export let completed = 0;
  export let total = 0;
  let minVal = 0;
  let maxVal = 100;

  const calcPercentage = (completed, total) => ((completed / total) * 100).toFixed(0);
</script>

<div class="w-full">
  <div class="mb-1 flex items-end justify-between gap-2 text-slate-700 dark:text-slate-300">
    <span>{titleHeading}</span>
    <span>{calcPercentage(completed, total)}%</span>
  </div>
  <div class="flex h-2.5 w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800" role="progressbar" aria-label="default progress bar" aria-valuenow={completed} aria-valuemin={minVal} aria-valuemax={maxVal}>
    <div class="h-full rounded-xl bg-blue-700 dark:bg-blue-600" style={`width: ${calcPercentage(completed, total)}%`}>
    </div>
  </div>
</div>