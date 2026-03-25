import BpkCard from '@skyscanner/backpack-web/bpk-component-card';

export default function FlightCard({ flight }) {
  return (
    <BpkCard>
      <h3>{flight.airline}</h3>
      <p>{flight.from} → {flight.to}</p>
      <p>{flight.departureTime} - {flight.arrivalTime}</p>
      <p>${flight.price}</p>
    </BpkCard>
  );
}

export{FlightCard}