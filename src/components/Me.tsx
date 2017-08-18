import * as React from 'react';

export class Me extends React.Component<{ userStore: { uid: string } }, {}> {

    render() {

        return (
            <div>
                <span>{this.props.userStore.uid}</span>
            </div>
        );

    }

}