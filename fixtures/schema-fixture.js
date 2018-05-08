import { schema } from 'normalizr';

const earningSchema = new schema.Entity(
  'earnings',
  {},
  { idAttribute: 'reportId' }
);
const stockSchema = new schema.Entity('stocks', {
  lastEarningsReport: earningSchema,
  quarterEarnings: [earningSchema],
});

const companySchema = new schema.Entity('companies', {
  stock: stockSchema,
});

export const Schemas = {
  STOCK: stockSchema,
  STOCK_ARRAY: [stockSchema],
  COMPANY: companySchema,
  COMPANY_ARRAY: [companySchema],
};
