export interface type_loadout {
  id: number;
  name: string;
  primaryweapon: string;
  subweapon: string;
  gadget1: string;
  gadget2: string;
}

export interface Equipment {
  name: string;
  image: string;
  item_type: string;
}

export interface ItemCardProps {
  item: { name: string; image: string };
  isSelected: boolean;
  isDisabled?: boolean;
  onSelect: () => void;
}
