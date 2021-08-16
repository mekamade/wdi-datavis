from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base, DeferredReflection
from sqlalchemy.orm import scoped_session, sessionmaker

connection_string = "postgresql://postgres:password@0.0.0.0:5432/wdi_worldbank"
engine = create_engine(connection_string)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base(cls=DeferredReflection)
Base.query = db_session.query_property()
