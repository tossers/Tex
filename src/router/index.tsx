import * as React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'

class Demo extends React.Component<{}, {}> {
    render() {
        return (
            <div> Demo </div>
        )
    }
}

export class Routers extends React.Component<{}, {}> {
    render() {
        return (
            <BrowserRouter basename="/">
                <Route path="/" component={Demo}/>
            </BrowserRouter>
        )
    }
}