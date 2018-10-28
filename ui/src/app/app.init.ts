import { DRToolsService } from 'ng-drtools';

import { environment } from '../environments/environment';

export const AppInitFactory = () => {
    return async () => {
        console.log(`Initiazing...`);

        DRToolsService.SetConfig({
            host: '',
            mysqlUri: environment.api.restUri,
        });

        // @todo add any initiaization code here.
    };
}
