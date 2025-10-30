import { TableDataClient } from '@common';
import * as TableDataFormDataBuilder from '../table-data-form-data-builder/table-data-form-data-builder';
import { isErrorResponse } from './table-data-client';

describe('TableDataClient', () => {
    let dataTableFormDataBuilder;
    let url;
    let formData;
    let bugSplatApiClient;
    let response;

    let service: TableDataClient;

    beforeEach(() => {
        url = 'https://woot.com';
        formData = { form: 'data!' };
        response = { rows: [{ yee: 'ha!' }], pageData: { woo: 'hoo!' } };
        dataTableFormDataBuilder = jasmine.createSpyObj('DataTableFormDataBuilder', [
            'withDatabase',
            'withColumnGroups',
            'withFilterGroups',
            'withPage',
            'withPageSize',
            'withSortColumn',
            'withSortOrder',
            'build',
        ]);
        dataTableFormDataBuilder.withDatabase.and.returnValue(dataTableFormDataBuilder);
        dataTableFormDataBuilder.withColumnGroups.and.returnValue(dataTableFormDataBuilder);
        dataTableFormDataBuilder.withFilterGroups.and.returnValue(dataTableFormDataBuilder);
        dataTableFormDataBuilder.withPage.and.returnValue(dataTableFormDataBuilder);
        dataTableFormDataBuilder.withPageSize.and.returnValue(dataTableFormDataBuilder);
        dataTableFormDataBuilder.withSortColumn.and.returnValue(dataTableFormDataBuilder);
        dataTableFormDataBuilder.withSortOrder.and.returnValue(dataTableFormDataBuilder);
        dataTableFormDataBuilder.build.and.returnValue(formData);
        spyOn(TableDataFormDataBuilder, 'TableDataFormDataBuilder').and.returnValue(
            dataTableFormDataBuilder
        );

        const json = () => response;
        bugSplatApiClient = jasmine.createSpyObj('BugSplatApiClient', ['fetch']);
        bugSplatApiClient.fetch.and.resolveTo({ status: 200, json });

        service = new TableDataClient(bugSplatApiClient, url);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getData', () => {
        let database;
        let columnGroups;
        let filterGroups;
        let page;
        let pageSize;
        let sortColumn;
        let sortOrder;
        let result;

        beforeEach(async () => {
            database = 'Black Rifle Coffee';
            columnGroups = ['group', 'group again'];
            filterGroups = ['filter', 'anotha 1'];
            page = 9;
            pageSize = 9001;
            sortColumn = 'sorty';
            sortOrder = 'mcOrder';
            const response = await service.postGetData({
                database,
                columnGroups,
                filterGroups,
                page,
                pageSize,
                sortColumn,
                sortOrder,
            });
            if (isErrorResponse(response)) {
                throw new Error(response.message);
            }
            result = await response.json();
        });

        it('should call DataTaableFormDataBuilder with database', () => {
            expect(dataTableFormDataBuilder.withDatabase).toHaveBeenCalledWith(database);
        });

        it('should call DatatableFormDataBuilder with columng groups', () => {
            expect(dataTableFormDataBuilder.withColumnGroups).toHaveBeenCalledWith(columnGroups);
        });

        it('should call DataTableFormDataBuilder with filter groups', () => {
            expect(dataTableFormDataBuilder.withFilterGroups).toHaveBeenCalledWith(filterGroups);
        });

        it('should call DataTableFormDataBuilder with page', () => {
            expect(dataTableFormDataBuilder.withPage).toHaveBeenCalledWith(page);
        });

        it('should call DataTableFormDataBuilder with page size', () => {
            expect(dataTableFormDataBuilder.withPageSize).toHaveBeenCalledWith(pageSize);
        });

        it('should call DataTableFormDataBuilder with sort column', () => {
            expect(dataTableFormDataBuilder.withSortColumn).toHaveBeenCalledWith(sortColumn);
        });

        it('should call DataTableFormDataBuilder with sort order', () => {
            expect(dataTableFormDataBuilder.withSortOrder).toHaveBeenCalledWith(sortOrder);
        });

        it('should call build on DataTableFormDataBuilder', () => {
            expect(dataTableFormDataBuilder.build).toHaveBeenCalled();
        });

        it('should call fetch with correct url', () => {
            expect(bugSplatApiClient.fetch).toHaveBeenCalledWith(url, jasmine.anything());
        });

        it('should call fetch with form data from DataTableFormDataBuilder', () => {
            expect(bugSplatApiClient.fetch).toHaveBeenCalledWith(
                jasmine.anything(),
                jasmine.objectContaining({
                    body: formData,
                })
            );
        });

        it('should return value from api', () => {
            expect(result).toEqual(
                jasmine.objectContaining({
                    rows: response.rows,
                    pageData: response.pageData,
                })
            );
        });

        it('should throw if api returns error response', async () => {
            const expectedErrorMessage = 'Internal Server Error';
            bugSplatApiClient.fetch.and.resolveTo({
                status: 500,
                message: expectedErrorMessage,
            });
            try {
                await service.postGetData({
                    filterGroups,
                    page,
                    pageSize,
                    sortColumn,
                    sortOrder,
                });
            } catch (error: any) {
                expect(error).toBeInstanceOf(Error);
                expect(error.message).toBe(expectedErrorMessage);
            }
        });
    });
});
