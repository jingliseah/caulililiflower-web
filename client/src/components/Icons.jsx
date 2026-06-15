/**
 * Shared icon components backed by Font Awesome Free.
 * Used by: StorefrontLayout, CartDrawer.
 */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faUser,
  faBars,
  faXmark,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export const CartIcon  = () => <FontAwesomeIcon icon={faCartShopping} style={{ fontSize: "20px" }} />;
export const UserIcon  = () => <FontAwesomeIcon icon={faUser}         style={{ fontSize: "20px" }} />;
export const MenuIcon  = () => <FontAwesomeIcon icon={faBars}         style={{ fontSize: "20px" }} />;
export const CloseIcon = () => <FontAwesomeIcon icon={faXmark}        style={{ fontSize: "20px" }} />;
export const TrashIcon = () => <FontAwesomeIcon icon={faTrash}        style={{ fontSize: "14px" }} />;
