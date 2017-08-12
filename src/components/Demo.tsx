import * as React from "react";
import {demo} from "../stores";
import {observer} from "mobx-react";

@observer
export class Demo extends React.Component<{name?:string,pass?:string}, {}> {

    render() {

        return (
            <div>
                {demo.timeStr}
                <button onClick={() => {
                    demo.addTime()
                }}>+
                </button>
                <button onClick={() => {
                    demo.subTime()
                }}>-
                </button>
                <button onClick={() => {
                    demo.addTimeAync()
                }}>Async+
                </button>
            </div>
        )
    }

}