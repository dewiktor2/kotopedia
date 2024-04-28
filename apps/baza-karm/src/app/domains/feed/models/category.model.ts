export type category =
  | 'wszystkie'
  | 'polecane'
  | 'monobialkowe'
  | 'chore-nerki'
  | 'chora-trzustka'
  | 'kocięta';

export type categoryValue = 
| 'wszystkie'
| 'Polecane'
| 'Monobiałkowe'
| 'Chore nerki'
| 'Chora trzustka'
| 'Kocięta';

export const categories: Record<category, categoryValue | undefined> = {
  ['wszystkie']: undefined,
  ['polecane']: 'Polecane',
  ['monobialkowe']: 'Monobiałkowe',
  ['chore-nerki']: 'Chore nerki',
  ['chora-trzustka']: 'Chora trzustka',
  ['kocięta']: 'Kocięta',
};
