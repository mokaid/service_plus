export const selectOptions = (data: any[]) => {
    if ( !data ) return [];

    return data.map(item => ({
        label: item,
        value: item
    }))
}