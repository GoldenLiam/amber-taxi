import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';


function BottomTripCard() {
  return (
    <Card id='bottomTripCard'>
      <Card.Body className='text-center'>

        <Image src="images/avatar_male.png" className="mb-2" style={{width: '75px', height: '75px', border: '2px solid #F37021', padding: '2px'}} roundedCircle />

        <Card.Subtitle className="mb-1 text-muted">Lil bị</Card.Subtitle>
        <Card.Text className='text-center'>

          <i className="bi bi-telephone-fill" style={{ fontSize: 25, color: '#F37021', marginRight: 8 }}></i>

          <i className="bi bi-chat-dots text-success"  style={{ fontSize: 25, marginLeft: 8 }}></i>

        </Card.Text>
        
      </Card.Body>
    </Card>
  );
}

export default BottomTripCard;