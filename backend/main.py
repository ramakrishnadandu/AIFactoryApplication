from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import logging

# Setting up basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = "sqlite:///./test.db"

# Database setup
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Pydantic models
class ItemCreate(BaseModel):
    name: str
    description: str

class Item(BaseModel):
    id: int
    name: str
    description: str

    class Config:
        orm_mode = True

# SQLAlchemy models
class ItemDB(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)

# Create database tables
Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# FastAPI app
app = FastAPI()

@app.post("/items/", response_model=Item)
def create_item(item: ItemCreate, db: Session = Depends(get_db)):
    db_item = ItemDB(name=item.name, description=item.description)
    try:
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        logger.info("Item created: %s", db_item)
    except Exception as e:
        logger.error("Error creating item: %s", e)
        db.rollback()
        raise HTTPException(status_code=500, detail="Error creating item")
    return db_item

@app.get("/items/{item_id}", response_model=Item)
def read_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(ItemDB).filter(ItemDB.id == item_id).first()
    if db_item is None:
        logger.warning("Item not found: %s", item_id)
        raise HTTPException(status_code=404, detail="Item not found")
    logger.info("Item retrieved: %s", db_item)
    return db_item

@app.get("/items/", response_model=list[Item])
def read_items(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    items = db.query(ItemDB).offset(skip).limit(limit).all()
    logger.info("Retrieved %d items", len(items))
    return items

@app.delete("/items/{item_id}", response_model=Item)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(ItemDB).filter(ItemDB.id == item_id).first()
    if db_item is None:
        logger.warning("Item not found for deletion: %s", item_id)
        raise HTTPException(status_code=404, detail="Item not found")
    try:
        db.delete(db_item)
        db.commit()
        logger.info("Item deleted: %s", db_item)
    except Exception as e:
        logger.error("Error deleting item: %s", e)
        db.rollback()
        raise HTTPException(status_code=500, detail="Error deleting item")
    return db_item

@app.put("/items/{item_id}", response_model=Item)
def update_item(item_id: int, item: ItemCreate, db: Session = Depends(get_db)):
    db_item = db.query(ItemDB).filter(ItemDB.id == item_id).first()
    if db_item is None:
        logger.warning("Item not found for update: %s", item_id)
        raise HTTPException(status_code=404, detail="Item not found")

    try:
        db_item.name = item.name
        db_item.description = item.description
        db.commit()
        db.refresh(db_item)
        logger.info("Item updated: %s", db_item)
    except Exception as e:
        logger.error("Error updating item: %s", e)
        db.rollback()
        raise HTTPException(status_code=500, detail="Error updating item")
    
    return db_item