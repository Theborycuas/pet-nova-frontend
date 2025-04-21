import React from "react";
// import { Link } from 'react-router-dom';
import { Row, Col, Card } from "react-bootstrap";
//import BarChart from "./bar";
import LineChart from "./line.jsx";
import AreaChart from "./area.jsx";
import PolarChart from "./polar.jsx";
import DonutChart from "./donut.jsx";

function ChartChartist() {
   return (
      <>
         <Row>
            <Col lg={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Line</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <LineChart />
                  </Card.Body>
               </Card>
            </Col>

            <Col lg={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Area</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <AreaChart />
                  </Card.Body>
               </Card>
            </Col>

            <Col lg={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Bi Polar</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <PolarChart />
                  </Card.Body>
               </Card>
            </Col>

            <Col lg={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Donut</Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <DonutChart />
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </>
   );
}

export default ChartChartist;
