
import graphene
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType
from model import *

class Country(SQLAlchemyObjectType):
    class Meta:
        model = CountryModel
        interfaces = (graphene.relay.Node, )

class Series(SQLAlchemyObjectType):
    class Meta:
        model = SeriesModel
        interfaces = (graphene.relay.Node, )

class CountrySeries(SQLAlchemyObjectType):
    class Meta:
        model = CountrySeriesModel
        interfaces = (graphene.relay.Node, )

class Data(SQLAlchemyObjectType):
    class Meta:
        model = DataModel
        interfaces = (graphene.relay.Node, )

class Footnote(SQLAlchemyObjectType):
    class Meta:
        model = FootnoteModel
        interfaces = (graphene.relay.Node, )

class SeriesTime(SQLAlchemyObjectType):
    class Meta:
        model = SeriesTimeModel
        interfaces = (graphene.relay.Node, )

class Query(graphene.ObjectType):
    node = graphene.relay.Node.Field()

    country = graphene.Field(
        Country,
        country_code=graphene.String()
    )
    all_countries = graphene.List(Country)

    indicator = graphene.Field(
        Series,
        indicator_code=graphene.String()
    )
    all_indicators = graphene.List(Series)

    country_indicator_info = graphene.Field(
        CountrySeries,
        country_code=graphene.String(),
        indicator_code=graphene.String()
    )
    indicator_data = graphene.List(
        Data,
        indicator_code=graphene.String(),
        country_codes=graphene.List(graphene.String)
    )
    footnote = graphene.Field(
        Footnote,
        country_code=graphene.String(),
        indicator_code=graphene.String(),
        year=graphene.Int()
    )
    indicator_year_info = graphene.Field(
        SeriesTime,
        indicator_code=graphene.String(),
        year=graphene.Int()
    )

    def resolve_country(root, info, country_code):
        query = Country.get_query(info)
        return query.get(country_code)

    def resolve_all_countries(root, info):
        query = Country.get_query(info)
        return query.all()

    def resolve_indicator(root, info, indicator_code):
        query = Series.get_query(info)
        return query.get(indicator_code)

    def resolve_all_indicators(root, info):
        query = Series.get_query(info)
        return query.all()

    def resolve_country_indicator_info(root, info, country_code, indicator_code):
        query = CountrySeries.get_query(info)
        return query.get((country_code, indicator_code))

    def resolve_indicator_data(root, info, indicator_code, country_codes):
        query = Data.get_query(info)
        return query.filter((DataModel.indicator_code == indicator_code) &
                             DataModel.country_code.in_(country_codes))

    def resolve_footnote(root, info, country_code, indicator_code, year):
        query = Footnote.get_query(info)
        query_year = f"yr{year}"
        return query.get((country_code, indicator_code, query_year))

    def resolve_indicator_year_info(root, info, indicator_code, year):
        query = SeriesTime.get_query(info)
        query_year = f"yr{year}"
        return query.get((indicator_code, query_year))

schema = graphene.Schema(query=Query)
