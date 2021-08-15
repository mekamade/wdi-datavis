from sqlalchemy import Column, Integer, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from database import Base, engine

class CountryModel(Base):
    __tablename__ = 'country'
    country_code = Column(String(3), primary_key=True, unique=True, nullable=False)
    short_name = Column(String(64), unique=True, nullable=False)
    table_name = Column(String(64), unique=True, nullable=False)
    long_name =  Column(String(256), unique=True, nullable=False)

class SeriesModel(Base):
    __tablename__ = 'series'
    series_code = Column(String(64), primary_key=True, unique=True, nullable=False)
    topic = Column(String(256), nullable=False)
    indicator_name = Column(String(256), unique=True, nullable=False)

class CountrySeriesModel(Base):
    __tablename__ = 'country_series'
    country_code = Column(String(3), ForeignKey('country.country_code'), primary_key=True, nullable=False)
    series_code = Column(String(64), ForeignKey('series.series_code'), primary_key=True, nullable=False)
    description = Column(Text, nullable=False)

class DataModel(Base):
    __tablename__ = 'data'
    country_name = Column(String(64), nullable=False)
    country_code = Column(String(3), ForeignKey('country.country_code'), primary_key=True, nullable=False)
    indicator_name = Column(String(256), nullable=False)
    series_code = Column(String(64), ForeignKey('series.series_code'), primary_key=True, nullable=False)

class FootnoteModel(Base):
    __tablename__ = 'footnote'
    country_code = Column(String(3), ForeignKey('country.country_code'), primary_key=True, nullable=False)
    series_code = Column(String(64), ForeignKey('series.series_code'), primary_key=True, nullable=False)
    year = Column(String(6), primary_key=True, nullable=False)
    description = Column(Text, nullable=False)

class SeriesTimeModel(Base):
    __tablename__ = 'series_time'
    series_code = Column(String(64), ForeignKey('series.series_code'), primary_key=True, nullable=False)
    year = Column(String(6), primary_key=True, nullable=False)
    description = Column(Text, nullable=False)

Base.prepare(engine)
