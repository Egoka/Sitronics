import WithImageTiles from "./WithImageTiles.vue"
import GridImage from "./GridImage.vue"
import StartNavBar from "./control/StartNavBar.vue"
import Popover from "./optional/Popover.vue"
import StSelect from "./form/StSelect.vue"
import Dropdown from "./functional/Dropdown.vue"
import TitleList from "./optional/TitleList.vue"
import StInput from "./form/StInput.vue"
import Icons from "./functional/Icons.vue"
import Label from "./functional/Label.vue"
import NavBar from "./control/NavBar.vue"
import Link from "./functional/Link.vue"
import StForm from "./form/StForm.vue"
import CardList from "./CardList.vue"
type Components =
  | "WithImageTiles"
  | "GridImage"
  | "StartNavBar"
  | "Popover"
  | "StSelect"
  | "Dropdown"
  | "TitleList"
  | "StInput"
  | "Icons"
  | "Label"
  | "NavBar"
  | "Link"
  | "StForm"
  | "CardList"
const listComponents = {
  WithImageTiles,
  GridImage,
  StartNavBar,
  Popover,
  StSelect,
  Dropdown,
  TitleList,
  StInput,
  Icons,
  Label,
  NavBar,
  Link,
  StForm,
  CardList,
}
export {
  type Components,
}
export default listComponents
