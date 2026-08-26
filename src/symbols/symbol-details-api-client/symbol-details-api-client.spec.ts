import { createFakeBugSplatApiClient } from '@spec/fakes/common/bugsplat-api-client';
import { createFakeFormData } from '@spec/fakes/common/form-data';
import { createFakeResponseBody } from '@spec/fakes/common/response';
import { SymbolDetailsApiClient } from '@symbols';
import * as TableDataClientModule from '../../common/data/table-data/table-data-client/table-data-client';
import { SymbolDetailsApiRow } from '../symbol-details-api-row/symbol-details-api-row';

describe('SymbolDetailsApiClient', () => {
    const database = 'fred';
    let fakeFormData;
    let fakeBugSplatApiClient;
    let fakeSuccessResponse;
    let rows;
    let tableDataClient;
    let tableDataClientResponse;

    let symbolDetailsApiClient: SymbolDetailsApiClient;

    beforeEach(() => {
        fakeFormData = createFakeFormData();
        fakeSuccessResponse = createFakeResponseBody(200, {});
        fakeBugSplatApiClient = createFakeBugSplatApiClient(fakeFormData, fakeSuccessResponse);

        rows = [
            {
                application: 'myConsoleCrasher',
                version: '2022.4.20.0',
                moduleName: 'myConsoleCrasher.pdb',
                s3Key: 'Fred/myConsoleCrasher-2022.4.20.0/myConsoleCrasher.pdb',
                s3Bucket: 'bugsplat-symbols',
                symbolType: 'Windows',
                guid: '1254DF350E094F4582BB32676F926259',
                size: 1047851,
                lastUploaded: '2022-04-20T14:20:14Z',
                lastModified: '2022-04-20T14:20:14Z',
                lastAccessed: '2022-04-21T02:06:31Z',
                downloadFile: 'https://app.bugsplat.com/symsrv/download?database=fred'
            },
        ];
        tableDataClientResponse = createFakeResponseBody(200, { rows });
        tableDataClient = jasmine.createSpyObj('TableDataClient', ['postGetData']);
        tableDataClient.postGetData.and.resolveTo(tableDataClientResponse);
        spyOn(TableDataClientModule, 'TableDataClient').and.returnValue(tableDataClient);

        symbolDetailsApiClient = new SymbolDetailsApiClient(fakeBugSplatApiClient);
    });

    describe('getSymbolDetails', () => {
        let result;

        beforeEach(async () => result = await symbolDetailsApiClient.getSymbolDetails({ database }));

        it('should call postGetData with request', () => {
            expect(tableDataClient.postGetData).toHaveBeenCalledWith(
                jasmine.objectContaining({
                    database
                })
            );
        });

        it('should return result mapped to SymbolDetailsApiRows', () => {
            expect(result.rows).toEqual(
                jasmine.arrayContaining([
                    new SymbolDetailsApiRow(rows[0])
                ])
            );
        });

        it('should throw if response is an error', async () => {
            const message = 'Unauthorized';
            tableDataClient.postGetData.and.resolveTo(createFakeResponseBody(403, { message }));

            await expectAsync(symbolDetailsApiClient.getSymbolDetails({ database })).toBeRejectedWithError(message);
        });
    });
});
