import { ReactNode } from "react"
import styles from "./jumbotron.module.css"

interface JumbotronProps {
  children: ReactNode;
}

const Jumbotron = ({children}: JumbotronProps) => 
  <div className={"p-3 p-sm-5 rounded-lg m-3 m-sm-5 " + styles.jumbotron}>
    {children}
  </div>

export default Jumbotron;