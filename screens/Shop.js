import { Button, Card, Divider, Icon, List, Text } from '@ui-kitten/components';
import React from 'react';
import { Dimensions, ImageBackground, ScrollView, StyleSheet, View } from 'react-native';

import API_URL from '../api/API_URL';
const products = [{title:"Tree",category:"Eco",price:100,image:"https://westwoodhorizon.com/wp-content/uploads/2019/11/Screenshot_20191109-2207372-900x893.png"},{title:"Tree",category:"Eco",price:100,image:"https://westwoodhorizon.com/wp-content/uploads/2019/11/Screenshot_20191109-2207372-900x893.png"},{title:"Tree",category:"Eco",price:100,image:"https://westwoodhorizon.com/wp-content/uploads/2019/11/Screenshot_20191109-2207372-900x893.png"},{title:"Tree",category:"Eco",price:100,image:"https://westwoodhorizon.com/wp-content/uploads/2019/11/Screenshot_20191109-2207372-900x893.png"}]
const renderItemFooter = (item) => (
    <View style={styles.itemFooter}>
        <Text category='s1'>
            ${item.price}
        </Text>
        <Button
            style={styles.iconButton}
            size='small'
            accessoryLeft={(style)=><Icon {...style} name='shopping-cart'/>}
        />
    </View>
);

const renderItemHeader = (item) => (
    <ImageBackground
        style={styles.itemHeader}
        source={{uri:item.image}}
    />
);
const renderProductItem = ({ item }) => (
    <Card
        style={styles.productItem}
        header={() => renderItemHeader(item)}
        footer={() => renderItemFooter(item)}
    >
        <Text category='s1'>
            {item.title}
        </Text>
        <Text
            appearance='hint'
            category='c1'>
            {item.category}
        </Text>
    </Card>
);
const Shop = () => {

    return (
        <View
            style={{
                flex: 1,
                padding: 20,
                backgroundColor: "#fff"
            }}>
            <View><Text style={{ textAlign: 'center', fontWeight: "700", fontSize: 30, paddingBottom: 20 }}>Shop</Text></View><Divider style={{ marginBottom: 10 }} />
            <List
                contentContainerStyle={styles.productList}
                data={products}
                numColumns={2}
                renderItem={renderProductItem}
            />

        </View>
    )
}
const styles = StyleSheet.create({

    productList: {
        paddingHorizontal: 8,
        paddingVertical: 16,
    },
    productItem: {
        flex: 1,
        margin: 8,
        maxWidth: Dimensions.get('window').width / 2 - 24
    },
    itemHeader: {
        height: 140,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    iconButton: {
        paddingHorizontal: 0,
    },
});
export default Shop;

