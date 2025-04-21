import React from "react";
// import { Link } from 'react-router-dom';
import { Row, Col, Card } from "react-bootstrap";

import PageTitle from "../../../layouts/PageTitle.jsx";
import BarChart1 from "./bar1.jsx";
import BarChart5 from "./bar5.jsx";
import BarChart6 from "./bar6.jsx";
import LineChart1 from "./line1.jsx";
import DualLine from "./dualLine.jsx";
import BasicArea from "./basicArea.jsx";
import GradientArea from "./gradinetArea.jsx";
import DualArea from "./dualArea.jsx";
//import Radar from "./radar";
import PolarChart from "./polar.jsx";
//import DualLine2 from "./dualLine2";

import ChartPie from "./pie.jsx";

function ChartChartjs() {
  return (
    <>
      <PageTitle motherMenu="Charts" activeMenu="ChartJs" />
      <Row>
	   <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
              <h4 className="card-title">Bar chart</h4>
            </Card.Header>
            <Card.Body>
              <BarChart1 />
            </Card.Body>
          </Card>
        </Col>
       <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
              <h4 className="card-title">Bar chart</h4>
            </Card.Header>
            <Card.Body>
              <BarChart5 />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
              <h4 className="card-title">Bar chart</h4>
            </Card.Header>
            <Card.Body>
              <BarChart6 />
            </Card.Body>
          </Card>
        </Col>
		 <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
				<h4 className="card-title">Line chart</h4>
            </Card.Header>
            <Card.Body>
              <LineChart1 />
            </Card.Body>
          </Card>
        </Col> 
        <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
              <h4 className="card-title">Dual Line chart</h4>
            </Card.Header>
            <Card.Body>
              <DualLine />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
              <h4 className="card-title">Basic Area Chart</h4>
            </Card.Header>
            <Card.Body>
              <BasicArea />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
               <h4 className="card-title">Gradinet Area Chart</h4>
            </Card.Header>
            <Card.Body>
              <GradientArea />
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
               <h4 className="card-title">Dual Area Chart</h4>
            </Card.Header>
            <Card.Body>
              <DualArea />
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
               <h4 className="card-title">Pie</h4>
            </Card.Header>
            <Card.Body>
              <ChartPie />
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} lg={6}>
          <Card>
            <Card.Header>
                <h4 className="card-title">Polar Chart</h4>
            </Card.Header>
            <Card.Body>
              <PolarChart />
            </Card.Body>
          </Card>
		</Col>  
      </Row>
    </>
  );
}

export default ChartChartjs;
