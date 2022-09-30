import { Spinner as ReactstrapSpinner} from "reactstrap";
import style from "./spinner.module.css";

const Spinner = () =>
  <div className={style.spinner}>
    <ReactstrapSpinner color="light" />
  </div>

  export default Spinner;