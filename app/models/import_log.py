from sqlalchemy import Column, Integer, String

from app.database.db import Base


class ImportLog(Base):

    __tablename__ = "import_logs"

    id = Column(Integer, primary_key=True, index=True)

    source = Column(String)

    imported_count = Column(Integer)

    duplicates_skipped = Column(Integer)

