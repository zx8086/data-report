<!-- ProgressBar.svelte -->
<script>
  export let titleHeading = "Progress";
  export let completed = 0;
  export let total = 0;
  let minVal = 0;
  let maxVal = 100;
  const calcPercentage = (completed, total) => ((completed / total) * 100).toFixed(2);
</script>
<div class="w-4/5 my-2 py-1">
  <div class="flex text-xs justify-between gap-2 text-slate-700 dark:text-slate-300">
    <span>{titleHeading}</span>
    <span>{completed} out of {total} - {calcPercentage(completed, total)}%</span>
  </div>
  <div class="flex h-1 w-full text-xs overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800" role="progressbar" aria-label="default progress bar" aria-valuenow={completed} aria-valuemin={minVal} aria-valuemax={maxVal}>
    <div class="h-full rounded-xl bg-blue-700 dark:bg-blue-600" style={`width: ${calcPercentage(completed, total)}%`}>
    </div>
  </div>
</div>