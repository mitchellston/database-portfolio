import React from "react";
import styles from "./index.module.scss";
type props = {
  columns: string[];
  data: { [key: string]: string | number | boolean }[];
  position: { top: number; left: number };
};
function index(props: props) {
  return (
    <>
      <table
        className={styles.table}
        style={{ top: props.position.top, left: props.position.left }}
      >
        <tr>
          {props.columns.map((item, index) => {
            return <th key={index}>{item}</th>;
          })}
        </tr>
        {props.data.map((parentItem, index) => {
          return (
            <tr key={index}>
              {props.columns.map((item, index) => {
                return <td key={index}>{parentItem[item] as string}</td>;
              })}
            </tr>
          );
        })}
      </table>
    </>
  );
}

export default index;
