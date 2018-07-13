import React from 'react'
import ReactDOM from 'react-dom'
import Chart from './Chart'
import { getData } from './utils'
import { TypeChooser } from 'react-stockcharts/lib/helper'
import store from './Store'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const log = require('ololog').configure({locate: false})

class ChartComponent extends React.Component {
	componentDidMount() {
		getData().then(data => {
			this.setState({ data })
		})
	}
  render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
			<TypeChooser>
				{type => <Chart type={type} data={this.state.data} />}
			</TypeChooser>
		)
	}
}

setTimeout(function () {
  ReactDOM.render(
    <Provider store={store}><ChartComponent/></Provider>,
    document.getElementById('chart')
  )
}, 2000)


export function ___replace_order () {
  
}