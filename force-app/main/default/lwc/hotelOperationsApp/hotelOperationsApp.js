import { LightningElement } from "lwc";
const ROOMS = [
  {
    id: "1",
    number: "101",
    type: "Deluxe King",
    floor: 1,
    price: 4200,
    status: "Available",
    capacity: 2
  },
  {
    id: "2",
    number: "102",
    type: "Twin Deluxe",
    floor: 1,
    price: 3900,
    status: "Occupied",
    capacity: 2
  },
  {
    id: "3",
    number: "201",
    type: "Executive Suite",
    floor: 2,
    price: 7800,
    status: "Available",
    capacity: 3
  },
  {
    id: "4",
    number: "202",
    type: "Deluxe King",
    floor: 2,
    price: 4200,
    status: "Maintenance",
    capacity: 2
  },
  {
    id: "5",
    number: "301",
    type: "Presidential Suite",
    floor: 3,
    price: 12500,
    status: "Occupied",
    capacity: 4
  },
  {
    id: "6",
    number: "302",
    type: "Twin Deluxe",
    floor: 3,
    price: 3900,
    status: "Available",
    capacity: 2
  }
];
const GUESTS = [
  {
    id: "G01",
    name: "Radha Rani",
    email: "radha@gmail.com",
    phone: "+91 9876543210",
    visits: 4,
    tier: "Gold"
  },
  {
    id: "G02",
    name: "Krishna",
    email: "krishna@gmail.com",
    phone: "+91 9876543211",
    visits: 2,
    tier: "Silver"
  },
  {
    id: "G03",
    name: "Bala Rama",
    email: "balarama@gmail.com",
    phone: "+91 9876543212",
    visits: 7,
    tier: "Platinum"
  }
];
const BOOKINGS = [
  {
    id: "BK-2401",
    guest: "Radha Rani",
    room: "101",
    checkIn: "2026-11-03",
    checkOut: "2026-11-05",
    amount: 8400,
    status: "Confirmed"
  },
  {
    id: "BK-2402",
    guest: "Krishna",
    room: "102",
    checkIn: "2026-11-03",
    checkOut: "2026-11-04",
    amount: 3900,
    status: "Checked In"
  },
  {
    id: "BK-2403",
    guest: "Bala Rama",
    room: "201",
    checkIn: "2026-11-04",
    checkOut: "2026-11-07",
    amount: 23400,
    status: "Pending"
  }
];
export default class HotelOperationsApp extends LightningElement {
  rooms = ROOMS;
  guests = GUESTS;
  bookings = BOOKINGS;
  page = "dashboard";
  modal = false;
  get dashboard() {
    return this.page === "dashboard";
  }
  get roomPage() {
    return this.page === "rooms";
  }
  get bookingPage() {
    return this.page === "bookings";
  }
  get guestPage() {
    return this.page === "guests";
  }
  showDashboard() {
    this.page = "dashboard";
  }
  showRooms() {
    this.page = "rooms";
  }
  showBookings() {
    this.page = "bookings";
  }
  showGuests() {
    this.page = "guests";
  }
  openModal() {
    this.modal = true;
  }
  closeModal() {
    this.modal = false;
  }
  saveBooking(e) {
    this.bookings = [
      { ...e.detail, id: "BK-" + (2401 + this.bookings.length) },
      ...this.bookings
    ];
    this.modal = false;
    this.template
      .querySelector("c-hotel-toast")
      ?.show("Booking added to demo list");
  }
}
