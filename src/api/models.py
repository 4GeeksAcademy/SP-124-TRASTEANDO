from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Integer, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date, datetime

db = SQLAlchemy()


class User(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class AdminUser(db.Model):

    __tablename__ = "admin_user"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(120), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email
        }


class Client(db.Model):
    __tablename__ = "clients"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    photo_url: Mapped[str] = mapped_column(String(500), nullable=True)

    leases: Mapped[list["Leases"]] = relationship(
        back_populates="client", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_active": self.is_active,
            "photo_url": self.photo_url
        }


class Company(db.Model):

    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)
    cif: Mapped[str] = mapped_column(unique=True, nullable=False)
    address: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    photo: Mapped[str] = mapped_column(nullable=True)

    locations: Mapped[list["Location"]] = relationship(
        back_populates="company", cascade="all, delete-orphan")

    def serialize(self):

        return {
            "id": self.id,
            "name": self.name,
            "cif": self.cif,
            "address": self.address,
            "email": self.email,
            "photo": self.photo
        }


class Leases(db.Model):

    __tablename__ = "leases"

    id: Mapped[int] = mapped_column(primary_key=True)

    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)

    status: Mapped[str] = mapped_column(String(20), default="active")

    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id"), nullable=False)
    storage_id: Mapped[int] = mapped_column(
        ForeignKey("storage.id"), nullable=False)

    client: Mapped["Client"] = relationship(back_populates="leases")
    storage: Mapped["Storage"] = relationship(back_populates="leases") 

    def serialize(self):
        return {
            "id": self.id,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "status": self.status,
            "client_id": self.client_id,
            "storage_id": self.storage_id
        }


class Storage(db.Model):

    __tablename__ = "storage"

    id: Mapped[int] = mapped_column(primary_key=True)
    size: Mapped[str] = mapped_column(nullable=False)
    price: Mapped[str] = mapped_column(nullable=False)
    status: Mapped[bool] = mapped_column(nullable=False, default=True)
    photo: Mapped[str] = mapped_column(nullable=True)

    location_id: Mapped[int] = mapped_column(
        ForeignKey("location.id"), nullable=False)

    location: Mapped["Location"] = relationship(back_populates="storages")
    leases: Mapped[list["Leases"]] = relationship(
        back_populates="storage", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "size": self.size,
            "price": self.price,
            "status": self.status,
            "location_id": self.location_id,
            "photo": self.photo
        }


class Location(db.Model):

    __tablename__ = "location"

    id: Mapped[int] = mapped_column(primary_key=True)
    address: Mapped[str] = mapped_column(primary_key=False)
    city: Mapped[str] = mapped_column(nullable=False)
    latitude: Mapped[str] = mapped_column(nullable=False)
    longitude: Mapped[str] = mapped_column(nullable=False)
    photo: Mapped[str] = mapped_column(nullable=True)

    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id"), nullable=False)

    company: Mapped["Company"] = relationship(back_populates="locations")
    storages: Mapped[list["Storage"]] = relationship(
        back_populates="location", cascade="all, delete-orphan")

    def serialize(self):
        total_storages = len(self.storages)
        occupied_storages = sum(1 for s in self.storages if s.status)
        available_storages = total_storages - occupied_storages

        return {
            "id": self.id,
            "address": self.address,
            "city": self.city,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "photo": self.photo,
            "company_id": self.company_id,
            "company_name": self.company.name,
            "total_storages": total_storages,
            "occupied_storages": occupied_storages,
            "available_storages": available_storages
        }


class Message(db.Model):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    sender_id: Mapped[int] = mapped_column(Integer, nullable=False)
    receiver_id: Mapped[int] = mapped_column(Integer, nullable=False)
    sender_role: Mapped[str] = mapped_column(String(50), nullable=False)
    receiver_role: Mapped[str] = mapped_column(String(50), nullable=False)
    content: Mapped[str] = mapped_column(String(1000), nullable=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def serialize(self):

        sender_name = None
        sender_photo = None

        if self.sender_role == "client":
            sender = Client.query.get(self.sender_id)
            if sender:
                sender_name = sender.email
                sender_photo = sender.photo_url

            elif self.sender_role == "company":
                sender = Company.query.get(self.sender_id)
            if sender:
                sender_name = sender.email
                sender_photo = sender.photo_url

        return {
            "id": self.id,
            "sender_id": self.sender_id,
            "receiver_id": self. receiver_id,
            "sender_role": self.sender_role,
            "receiver_role": self.receiver_role,
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
            "sender_name": sender_name,
            "sender_photo": sender_photo
        }

class Category(db.Model):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    products = db.relationship(
        "Product",
        back_populates="category",
        cascade="all, delete-orphan"
    )
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }
    
class Product(db.Model):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(255), nullable=False)
    description: Mapped[str] = mapped_column(db.String(1000), nullable=True)
    image_url: Mapped[str] = mapped_column(db.String(500), nullable=True)
    placement: Mapped[str] = mapped_column(db.String(255), nullable=True)
    
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(db.Integer, nullable=False)  # V1 simple (sin FK aún)

    created_at: Mapped[datetime] = mapped_column(db.DateTime, default=datetime.utcnow, nullable=False)

    category: Mapped["Category"] = relationship("Category", back_populates="products")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "placement": self.placement,
            "category_id": self.category_id,
            "category": self.category.serialize() if self.category else None,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "image_url": self.image_url,
        }