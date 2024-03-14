import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

function MenuNavbar() {

    const logoutUser = () => {
        localStorage.clear();
        window.location.href = "/login";
    }
    
    return (
        <Navbar key='md' expand='md' bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
            <Container fluid>
                <Navbar.Brand href="/" style={{fontSize:'20px'}}>
                    Amber Taxi
                </Navbar.Brand>

                <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} />
                
                <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-md`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-md`}
                    placement="end"
                    style={{width: "75%"}}
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>
                            Menu
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            <Nav.Link href="/booking-list">
                                <span style={{marginRight: 5}}>Cuốc xe</span>
                                {/* <span className="badge bg-light text-dark rounded-pill align-text-bottom">25</span> */}
                            </Nav.Link>

                            <Nav.Link href="#action2">Thông báo</Nav.Link>
                            
                            <Nav.Link href="#action3">FAQ</Nav.Link>

                            <NavDropdown
                                title="Tài khoản"
                                id={`offcanvasNavbarDropdown-expand-md`}
                            >
                                <NavDropdown.Item href="#action3">
                                    Thiết lập tài khoản
                                </NavDropdown.Item>

                                <NavDropdown.Item href="#action4">
                                    Báo cáo sự cố
                                </NavDropdown.Item>

                                <NavDropdown.Divider />

                                <NavDropdown.Item onClick={logoutUser}>
                                    Đăng xuất
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>

                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Nhập từ khóa... "
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-light rounded-circle">
                                <i className="bi bi-search"></i>
                            </Button>
                        </Form>
                    </Offcanvas.Body>

                </Navbar.Offcanvas>

            </Container>
        </Navbar>
    );
}

export default MenuNavbar;