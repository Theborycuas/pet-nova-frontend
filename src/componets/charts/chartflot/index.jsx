import { Row, Col, Card } from "react-bootstrap";
import BarChart from "./Bar.jsx";
import BarChart2 from "./BarChart2.jsx";
import BarChart3 from "./Bar3.jsx";
import BarChart4 from "./Bar4.jsx";
import LineChart from "./Line.jsx";
import LineChart2 from "./Line2.jsx";
import { Fragment } from "react";
import BasicLine from "./BasicLine.jsx";
import LineChart3 from "./Line3.jsx";

import PageTitle from "../../../layouts/PageTitle.jsx";

function ChartChartist() {
   return (
      <Fragment>
         <PageTitle motherMenu="Charts" activeMenu="Flot" />
         <Row>
            <Col xl={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Bar Chart </Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <BarChart />
                  </Card.Body>
               </Card>
            </Col>

            <Col xl={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Bar Chart </Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <BarChart3 />
                  </Card.Body>
               </Card>
            </Col>
            <Col xl={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Bar Chart </Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <BarChart4 />
                  </Card.Body>
               </Card>
            </Col>
            <Col xl={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Bar Chart </Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <BarChart2 />
                  </Card.Body>
               </Card>
            </Col>

            <Col xl={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Line Chart </Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <LineChart2 />
                  </Card.Body>
               </Card>
            </Col>

            <Col xl={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Line Chart </Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <LineChart />
                  </Card.Body>
               </Card>
            </Col>
            <Col xl={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Basic Line Chart </Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <BasicLine />
                  </Card.Body>
               </Card>
            </Col>
            <Col xl={6}>
               <Card>
                  <Card.Header>
                     <Card.Title>Basic Line Chart </Card.Title>
                  </Card.Header>
                  <Card.Body>
                     <LineChart3 />
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   );
}

export default ChartChartist;
