export const compactDataArray = (dataRows: any[], arrayFields: string[], arrayFieldsAlias: string[]) => {
  const result = dataRows.reduce((acc, cur) => {
    const prevDataRow = acc.find(({ id }) => id === cur.id);
    if (!prevDataRow) {
      return [
        ...acc,
        Object.fromEntries(Object.entries({
          ...cur,
          ...Object.fromEntries(arrayFields
            .map((field, index) => [arrayFieldsAlias[index], [cur[field]]
              .filter(e => e)]))
        })
          .filter(([key]) => !arrayFields.includes(key)))        
      ];
    } else {
      arrayFields.forEach((field, index) => {
        if (cur[field] && !prevDataRow[arrayFieldsAlias[index]].includes(cur[field])) {
          prevDataRow[arrayFieldsAlias[index]].push(cur[field]);
        }        
      });
    }
    return [...acc];
  }, []);
  return result;
}