export const getNameExtension = (fileName: string) => {
  const extension = fileName.toLowerCase().match(/.[a-z]{3,4}$/)?.[0] ?? '';
  const name = fileName.replace(extension, '');
  return { name, extension: extension.replace('.', '') };
};