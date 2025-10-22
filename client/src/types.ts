export interface type_loadout {
  id: number;
  name: string;
  primaryweapon: string;
  subweapon: string;
  gadget1: string;
  gadget2: string;
  price: number;
}

export interface Equipment {
  name: string;
  image: string;
  item_type: string;
  price: number;
}

export interface ItemCardProps {
  item: Equipment;
  isSelected: boolean;
  isDisabled?: boolean;
  // onSelect should receive an object with name and price (SelectedItem)
  onSelect: (selected: { name: string; price: number }) => void;
}
