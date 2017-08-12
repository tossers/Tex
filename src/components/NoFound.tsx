import * as React from "react";

export class NoFound extends React.Component<{location}, {}> {

    render() {
        return (
            <div>
                <h3>{this.props.location.pathname} Not Found!</h3>
            </div>
        )
    }

}