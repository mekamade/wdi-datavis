
import graphene
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType
from sqlalchemy.orm import column_property
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

# class DataResult(graphene.ObjectType):
#     country_code = graphene.String()
#     indicator_code = graphene.String()
#     yr2008 = graphene.Float()
#     yr2009 = graphene.Float()
#     yr2010 = graphene.Float()

class Query(graphene.ObjectType):

    node = graphene.relay.Node.Field()
    country = graphene.Field(Country, country_code=graphene.String(3))
    all_countries = graphene.List(Country)
    indicator = graphene.Field(Series, indicator_code=graphene.String(64))
    all_indicators = graphene.List(Series)
    footnote = graphene.Field(Footnote, country_code=graphene.String(3), indicator_code=graphene.String(64), year=graphene.Int())
    indicator_data = graphene.List(Data, indicator_code=graphene.String(64), country_codes=graphene.List(graphene.String))

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

    def resolve_footnote(root, info, country_code, indicator_code, year):
        query = Footnote.get_query(info)
        query_year = f"yr{year}"
        return query.get((country_code, indicator_code, query_year))


    def resolve_indicator_data(root, info, indicator_code, country_codes):
        query = Data.get_query(info)
        # selected_years = []
        # for year in range(start_year, end_year+1):
        #     selected_years.append(getattr(DataModel, f"yr{year}"))
        # years = column_property(
        #     select([func.CONCAT(*selected_years)])
        # )
        # columns_required = [DataModel.country_code, DataModel.indicator_code]
        #
        # return query.with_entities(*columns_required).filter((DataModel.indicator_code == indicator_code) &
        #                     DataModel.country_code.in_(country_codes))
        return query.filter((DataModel.indicator_code == indicator_code) &
                             DataModel.country_code.in_(country_codes))


schema = graphene.Schema(query=Query, types=[Country])
