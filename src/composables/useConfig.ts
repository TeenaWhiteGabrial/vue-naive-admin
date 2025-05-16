export function useConfig() {
  const genders = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
    { label: '保密', value: 'secret' },
  ]
  return {
    genders,
  }
}
