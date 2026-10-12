export default function filterItems(items, query, getSearchValues) {
  const normalize = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
  const normalizedQuery = normalize(query.trim());
  if (!normalizedQuery) return items;

  return items.filter((item) =>
    getSearchValues(item)
      .filter((value) => value !== null && value !== undefined)
      .some((value) => normalize(value).includes(normalizedQuery)),
  );
}