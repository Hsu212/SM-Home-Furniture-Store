from pydantic import BaseModel
from typing import List, Optional, Any

# --- Auth Schemas ---
class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

# --- Product Schemas ---
class ProductColor(BaseModel):
    name: str
    hex: str
    images: List[str]

class ProductBase(BaseModel):
    name: str
    price: float
    image: str
    description: str
    category: str
    discountPercent: Optional[int] = None
    colors: List[ProductColor]

class ProductResponse(ProductBase):
    id: int
    class Config:
        from_attributes = True

# --- Cart & Favorite Schemas ---
class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = 1
    selected_color: Optional[Any] = None

class CartItemResponse(BaseModel):
    id: int
    product: ProductResponse
    quantity: int
    selected_color: Optional[Any] = None
    class Config:
        from_attributes = True

class FavoriteCreate(BaseModel):
    product_id: int

class FavoriteResponse(BaseModel):
    id: int
    product: ProductResponse
    class Config:
        from_attributes = True