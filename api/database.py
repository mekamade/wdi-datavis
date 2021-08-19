from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base, DeferredReflection
from sqlalchemy.orm import scoped_session, sessionmaker
import os

hostname = os.getenv("DOCKER_POSTGRES_ID", default='localhost')


connection_string = f"postgresql://postgres:password@{hostname}:5432/wdi_worldbank"
engine = create_engine(connection_string)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base(cls=DeferredReflection)
Base.query = db_session.query_property()
