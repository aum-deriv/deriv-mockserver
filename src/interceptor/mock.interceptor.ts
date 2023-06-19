import { getFirstMatchingKey } from '../utils/object.utils';
import { intercepted_endpoints } from '../config/intercepted-endpoints.config';
import { authorize } from '../api/authorize.api';
import { transaction } from '../api/transaction.api';
import { walletMigration } from '../api/wallet-migration.api';
import { derivWSProxy } from './deriv-ws-proxy';
import { statement } from '../api/statement.api';
import { InterceptedAPIHandler } from '../types/base';
import { getAccountStatus } from '../api/get-account-status.api';

export const mockInterceptor = async (intercepted_args: InterceptedAPIHandler) => {
    const endpoint_type = getFirstMatchingKey(
        intercepted_args.data,
        intercepted_endpoints
    ) as (typeof intercepted_endpoints)[number];

    switch (endpoint_type) {
        case 'authorize':
            return await authorize(intercepted_args);
        case 'transaction':
            return await transaction(intercepted_args);
        case 'statement':
            return await statement(intercepted_args);
        case 'get_account_status':
            return await getAccountStatus(intercepted_args);
        case 'get_settings':
        case 'topup_virtual':
        case 'balance':
        case 'forget_all':
        case 'portfolio':
        case 'proposal_open_contract':
        case 'new_account_real':
        case 'new_account_virtual':
        case 'new_account_wallet':
        case 'get_available_accounts_to_transfer':
        case 'transfer_between_accounts':
            return;
        case 'wallet_migration':
            return await walletMigration(intercepted_args);
        default:
            return await derivWSProxy(intercepted_args);
    }
};
