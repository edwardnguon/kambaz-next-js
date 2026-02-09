"use client";
import { FormControl, FormSelect, FormCheck,
         InputGroup, Row, Col, Form, Button } from "react-bootstrap";
export default function BootstrapForms() {
  return (
    <div>
      <div id="wd-css-styling-forms">
        <h2>Forms</h2>
        <Form.Label>Email address</Form.Label>
        <FormControl type="email" placeholder="name@example.com" />
        <Form.Label>Example textarea</Form.Label>
        <FormControl as="textarea" rows={3} />
      </div>

      <div id="wd-css-styling-dropdowns">
        <h3>Dropdowns</h3>
        <FormSelect>
          <option value="0" defaultChecked>Open this select menu</option>
          <option value="1">One</option>
          <option value="2">Two</option>
          <option value="3">Three</option>
        </FormSelect>
      </div>

      <div id="wd-css-styling-switches">
        <h3>Switches</h3>
        <FormCheck type="switch" defaultChecked={false} label="Unchecked switch checkbox input"/>
        <FormCheck type="switch" defaultChecked={true}  label="Checked switch checkbox input"/>
        <FormCheck type="switch" defaultChecked={false} label="Unchecked disabled switch checkbox input" disabled/>
        <FormCheck type="switch" defaultChecked={true}  label="Checked disabled switch checkbox input"  disabled/>
      </div>

      <div id="wd-css-styling-range-and-sliders">
        <h3>Range</h3>
        <Form.Label>Example range</Form.Label>
        <Form.Range min={0} max={5} step={0.5} />
      </div>

      <div id="wd-css-styling-addons">
        <h3>Addons</h3>
        <InputGroup className="mb-3">
          <InputGroup.Text>$</InputGroup.Text>
          <InputGroup.Text>0.00</InputGroup.Text>
          <FormControl />
        </InputGroup>
        <InputGroup>
          <FormControl />
          <InputGroup.Text>$</InputGroup.Text>
          <InputGroup.Text>0.00</InputGroup.Text>
        </InputGroup>
      </div>

      <div id="wd-css-responsive-forms-1">
        <h3>Responsive forms</h3>
        <Form.Group as={Row} className="mb-3" controlId="email1">
          <Form.Label column sm={2}> Email </Form.Label>
          <Col sm={10}>
            <FormControl type="email" defaultValue="email@example.com" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="password1">
          <Form.Label column sm={2}> Password </Form.Label>
          <Col sm={10}>
            <FormControl type="password" />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="textarea2">
          <Form.Label column sm={2}> Bio </Form.Label>
          <Col sm={10}>
            <FormControl as="textarea" style={{ height: "100px" }} />
          </Col>
        </Form.Group>
      </div>

      <div id="wd-css-responsive-forms-2">
        <h3>Responsive forms 2</h3>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={2}> Email </Form.Label>
            <Col sm={10}> <FormControl type="email" placeholder="Email" /> </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
            <Form.Label column sm={2}> Password </Form.Label>
            <Col sm={10}> <FormControl type="password" placeholder="Password" /> </Col>
          </Form.Group>
          <fieldset>
            <Form.Group as={Row} className="mb-3">
              <Form.Label as="legend" column sm={2}> Radios </Form.Label>
              <Col sm={10}>
                <FormCheck type="radio" label="First radio" name="formHorizontalRadios" defaultChecked />
                <FormCheck type="radio" label="Second radio" name="formHorizontalRadios" />
                <FormCheck type="radio" label="Third radio" name="formHorizontalRadios" />
              </Col>
            </Form.Group>
          </fieldset>
          <FormCheck type="radio" label="Remember me" name="formHorizontalRadios" />
          <Col> <Button type="submit">Sign in</Button> </Col>
        </Form>
      </div>
    </div>
  );
}
