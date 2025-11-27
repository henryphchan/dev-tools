export const copyToClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.error('Clipboard copy failed', error);
  }
};
