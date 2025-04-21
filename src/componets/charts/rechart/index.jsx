import React from "react";
// import { Link } from 'react-router-dom';
import { Row, Col, Card } from "react-bootstrap";

import PageTitle from "../../../layouts/PageTitle.jsx";

import BarChartNoPadding from "./BarChartNoPadding.jsx";
import NagetivePositive from "./PositiveNagative2.jsx";
import TinyLineChart from "./TinyLineChart.jsx";
import LegendEffectOpacity from "./LegendEffectOpacity.jsx";

function RechartJs() {
   return (
      <>
         <PageTitle motherMenu="Charts" activeMenu="ReChartJs" />
         <Row>
            <Col lg={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Bar</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <BarChartNoPadding />
                  </Card.Body>
               </Card>
            </Col>
            <Col lg={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Bar</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <NagetivePositive />
                  </Card.Body>
               </Card>
            </Col>
            <Col lg={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Line</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <TinyLineChart />
                  </Card.Body>
               </Card>
            </Col>
            <Col lg={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Line</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <LegendEffectOpacity />
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </>
   );
}

export default RechartJs;
