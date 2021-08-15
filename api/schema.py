
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
    country = graphene.Field(Country, country_code=graphene.String(3))
    all_countries = graphene.List(Country)
    indicator = graphene.Field(Series, indicator_code=graphene.String(64))
    all_indicators = graphene.List(Series)

    def resolve_country(root, info, country_code):
        query = Country.get_query(info)
        return query.get(country_code)

    def resolve_all_countries(root, info):
        query = Country.get_query(info)
        return query

    def resolve_indicator(root, info, indicator_code):
        query = Series.get_query(info)
        return query.get(indicator_code)

    def resolve_all_indicators(root, info):
        query = Series.get_query(info)
        return query

schema = graphene.Schema(query=Query, types=[Country])
