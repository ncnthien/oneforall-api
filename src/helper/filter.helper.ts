export interface FilterObject {
  [index: string]: any
}

interface Query {
  [index: string]: any
}

export const generateQueryProductList = (filterObject: FilterObject) => {
  // mongoDB query object converted by filterObject
  const brandQuery: Query = {}
  const subBrandQuery: Query = {}
  const otherQuery: Query = {}

  for (const filter in filterObject) {
    if (typeof filterObject[filter] === 'object') {
      // if type of filter is object | Ex: price: {min: 100, max: 200}
      if ('min' in filterObject[filter]) {
        if ('max' in filterObject[filter]) {
          // if filter contains both min and max then insert query to otherQuery | EX: price: { $gte: 100, $lte: 200 }
          otherQuery[filter] = {
            $gte: filterObject[filter]['min'],
            $lte: filterObject[filter]['max'],
          }
        } else {
          // if filter contains only min then insert query to otherQuery | EX: price: { $gte: 100 }
          otherQuery[filter] = {
            $gte: filterObject[filter]['min'],
          }
        }
      } else {
        // if filter contains only max then insert query to otherQuery | EX: price: { $lte: 100 }
        otherQuery[filter] = {
          $lte: filterObject[filter]['max'],
        }
      }
    } else {
      // type of filter is string | Ex: brand: 'lenovo' or ram: '16gb' or
      if (filter === 'brand') {
        // if filter equal 'brand' then insert query to brandQuery | EX: value: 'lenovo'
        brandQuery['value'] = filterObject[filter]
      } else if (filter === 'subBrand') {
        // if filter equal 'subBrand' then insert 'value': ... to subBrandQuery | EX: value: 'thinkpad'
        subBrandQuery['value'] = filterObject[filter]
      } else {
        // the rest insert query to otherQuery | EX: ram: '16gb'
        otherQuery[`${filter}.value`] = filterObject[filter]
      }
    }
  }

  return { brandQuery, subBrandQuery, otherQuery }
}
