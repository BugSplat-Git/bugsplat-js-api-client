
import { ApiDataFilterGroup, OrderFilter } from '@common';
import FormData from 'form-data';

export class TableDataFormDataBuilder {

  constructor(
    private _formDataFactory: () => FormData,
    private _formParts: Record<string, string | number> = {},
  ) { }

  withColumnGroups(groups: Array<string> | undefined): TableDataFormDataBuilder {
    if (groups) {
      let groupsCount = 0;
      groups.forEach((group, i) => {
        this._formParts[`group${i}`] = group;
        groupsCount++;
      });
      this._formParts['groupscount'] = groupsCount;
    }

    return this;
  }

  withFilterGroups(groups: Array<ApiDataFilterGroup> | undefined): TableDataFormDataBuilder {
    if (groups) {
      let filtersCount = 0;
      groups.forEach((group) => {
        if (group.filters.length) {
          group.filters.forEach((filter, i) => {
            const firstFilter = i === 0;
            const lastFilter = i === group.filters.length - 1;
            this._formParts[`filtergroupopen${filtersCount}`] = firstFilter ? 1 : 0;
            this._formParts[`filteroperator${filtersCount}`] = firstFilter ? group.groupOperator?.value : group.filterOperator?.value;
            this._formParts[`filterdatafield${filtersCount}`] = filter.filterDataField;
            this._formParts[`filtercondition${filtersCount}`] = filter.filterCondition;
            this._formParts[`filtervalue${filtersCount}`] = filter.filterValue;
            this._formParts[`filtergroupclose${filtersCount}`] = lastFilter ? 1 : 0;
            filtersCount++;
          });
        }
      });
      this._formParts['filterscount'] = filtersCount;
    }

    return this;
  }

  withPage(page = 0): TableDataFormDataBuilder {
    this._formParts.pagenum = page;
    return this;
  }

  withPageSize(pageSize = 10): TableDataFormDataBuilder {
    this._formParts.pagesize = pageSize;
    return this;
  }

  withSortColumn(sortColumn: string | undefined): TableDataFormDataBuilder {
    if (sortColumn) {
      this._formParts.sortdatafield = sortColumn;
    }
    return this;
  }

  withSortOrder(sortOrder: OrderFilter | undefined): TableDataFormDataBuilder {
    if (sortOrder) {
      let translatedSortOrder;
      if (sortOrder === OrderFilter.none) {
        return this;
      } else if (sortOrder === OrderFilter.ascending) {
        translatedSortOrder = 'asc';
      } else if (sortOrder === OrderFilter.descending) {
        translatedSortOrder = 'desc';
      }
      this._formParts.sortorder = translatedSortOrder;
    }
    return this;
  }

  withDatabase(database: string | undefined): TableDataFormDataBuilder {
    if (database) {
      this._formParts.database = database;
    }
    return this;
  }

  withApplications(applications: Array<string>): TableDataFormDataBuilder {
    if (applications && applications.length) {
      this._formParts.appNames = applications.join(',');
    }
    return this;
  }

  withVersions(versions: Array<string>): TableDataFormDataBuilder {
    if (versions && versions.length) {
      this._formParts.versions = versions.join(',');
    }
    return this;
  }

  build(): FormData {
    const formData = this._formDataFactory();
    Object.entries(this._formParts).forEach(urlPart => formData.append(urlPart[0], `${urlPart[1]}`));
    return formData;
  }
}
